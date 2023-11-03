// @ts-check
const { test, expect } = require('@playwright/test');
const { startChangeWatcher, stopChangeWatcher } = require('../plugin/async-plugin');

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    startChangeWatcher(page)

    const TODO_ITEMS = [
      'buy some cheese',
      'feed the cat',
      'book a doctors appointment'
    ];

    await page.goto('https://demo.playwright.dev/todomvc');

    const newTodo = page.getByPlaceholder('What needs to be done?');

    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0]
    ]);

    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);

    await checkNumberOfTodosInLocalStorage(page, 2);

    await stopChangeWatcher();
  });
});

/**
 * @param {import('@playwright/test').Page} page
 * @param {number} expected
 */
async function checkNumberOfTodosInLocalStorage(page, expected) {
  return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
  }, expected);
}
