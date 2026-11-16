import test from 'node:test';
import assert from 'node:assert/strict';
import { createSelectionUsage } from '../resources/js/core/selectionUsage.js';
const capability = { key: 'ext.example.caption', resourceTypes: ['article'], type: 'string', editor: 'text', default: 'Default', presentation: 'secondary', validation: { maxLength: 8 } };
const resource = { id: 'article:1', type: 'article' };
test('consumer capabilities remain caller/type scoped and use shared defaults and validation', async () => {
 const options = { consumer: 'example', usageCapabilities: [capability], profile: { 'ext.example.caption': true } };
 const usage = createSelectionUsage(options);
 assert.equal(usage.definitions(resource)[0].presentation, 'secondary');
 assert.equal(usage.get(resource)['ext.example.caption'], 'Default');
 assert.equal(createSelectionUsage({ ...options, consumer: 'other' }).definitions(resource).length, 0);
 assert.equal(usage.definitions({ ...resource, type: 'tag' }).length, 0);
 usage.set(resource, capability.key, 'Too long a value');
 const result = await usage.validate([resource]);
 assert.ok(Object.keys(result.errors).length);
});
