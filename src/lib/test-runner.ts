import Database from 'better-sqlite3';
import path from 'path';
import assert from 'assert';

console.log('--- Running Database & Models Integration Test Suite ---');

const dbPath = path.join(process.cwd(), 'data', 'novel_app.db');
const db = new Database(dbPath);

try {
  // Test 1: Seeded Works Count
  const worksRow = db.prepare('SELECT COUNT(*) as count FROM works').get() as { count: number };
  assert(worksRow.count > 0, 'Works table should have seeded rows');
  console.log('✔ Test 1 Passed: Works table seeded successfully (Count:', worksRow.count, ')');

  // Test 2: Chapters Relational Linking
  const chapter = db.prepare('SELECT * FROM chapters WHERE workId = ?').get('work-1') as any;
  assert(chapter !== undefined, 'Chapter for work-1 should exist');
  assert.strictEqual(chapter.workId, 'work-1', 'Chapter workId must match parent work');
  console.log('✔ Test 2 Passed: Chapter relational linking confirmed');

  // Test 3: Creative Cards JSON Serialization
  const card = db.prepare('SELECT * FROM creative_cards WHERE id = ?').get('card-1') as any;
  assert(card !== undefined, 'Creative card-1 should exist');
  const tags = JSON.parse(card.tags);
  assert(Array.isArray(tags), 'Tags should parse to an array');
  const fields = JSON.parse(card.fields);
  assert(Array.isArray(fields), 'Fields should parse to an array');
  console.log('✔ Test 3 Passed: Creative card JSON field parsing confirmed');

  // Test 4: Planning Cards Persistence
  const planCard = db.prepare('SELECT * FROM planning_cards WHERE workId = ?').get('work-1') as any;
  assert(planCard !== undefined, 'Planning card for work-1 should exist');
  assert.strictEqual(planCard.boardType, 'snowflake', 'Board type should be snowflake');
  console.log('✔ Test 4 Passed: Planning card persistence confirmed');

  console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
} catch (err) {
  console.error('❌ Integration Test Failed:', err);
  process.exit(1);
} finally {
  db.close();
}
