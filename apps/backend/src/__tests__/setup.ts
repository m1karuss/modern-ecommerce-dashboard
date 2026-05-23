import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database connection
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up test data if needed
});

// Dummy test to prevent "no tests" error
describe('Test Setup', () => {
  it('should initialize test environment', () => {
    expect(true).toBe(true);
  });
});
