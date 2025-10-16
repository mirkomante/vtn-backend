#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function healthCheck() {
  try {
    console.log('🔍 Verificando connessione database...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connesso');

    console.log('🔍 Verificando tabelle principali...');
    const tables = [
      'User', 'session', 'categoria_piatti', 'piatti', 
      'allergeni', 'nazioni', 'vini', 'logs'
    ];
    
    for (const table of tables) {
      try {
        const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${table}"`);
        const count = result[0]?.count || 0;
        console.log(`✅ Tabella ${table}: OK (${count} record)`);
      } catch (error) {
        console.log(`❌ Tabella ${table}: ERRORE - ${error.message}`);
        throw error;
      }
    }

    console.log('🔍 Verificando migrazioni...');
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at 
      FROM _prisma_migrations 
      ORDER BY finished_at DESC 
      LIMIT 5
    `;
    console.log('✅ Migrazioni applicate:', migrations.length);
    migrations.forEach(migration => {
      console.log(`  - ${migration.migration_name} (${migration.finished_at})`);
    });

    console.log('🔍 Verificando vista elementi cancellati...');
    try {
      await prisma.$queryRaw`SELECT * FROM "ElementiCancellati" LIMIT 1`;
      console.log('✅ Vista elementi cancellati: OK');
    } catch (error) {
      console.log('⚠️ Vista elementi cancellati: Non disponibile (normale se non ci sono elementi cancellati)');
    }

    console.log('🔍 Verificando indici...');
    const indexes = await prisma.$queryRaw`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname
    `;
    console.log(`✅ Indici ottimizzati: ${indexes.length} trovati`);

    console.log('🔍 Verificando foreign keys...');
    const foreignKeys = await prisma.$queryRaw`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
    `;
    console.log(`✅ Foreign keys: ${foreignKeys.length} trovate`);

    console.log('🎉 Health check completato con successo!');
    console.log('');
    console.log('📊 Riepilogo:');
    console.log(`  - Tabelle verificate: ${tables.length}`);
    console.log(`  - Migrazioni applicate: ${migrations.length}`);
    console.log(`  - Indici ottimizzati: ${indexes.length}`);
    console.log(`  - Foreign keys: ${foreignKeys.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Health check fallito:', error.message);
    console.error('');
    console.error('💡 Verifica che:');
    console.error('   1. PostgreSQL sia in esecuzione');
    console.error('   2. DATABASE_URL sia configurato correttamente');
    console.error('   3. Le migrazioni siano state applicate');
    console.error('   4. Il database esista e sia accessibile');
    console.error('');
    console.error('🔧 Comandi utili:');
    console.error('   npm run prisma:generate');
    console.error('   npm run prisma:migrate:deploy');
    console.error('   npm run setup');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Esegui health check
healthCheck();
