const mysqlToSQLiteParser = require("../utils/mysqlToSQLiteParser"); 

describe("mysqlToSQLiteParser", () => {

  test("converts NOW() to CURRENT_TIMESTAMP", () => {
    expect(mysqlToSQLiteParser("SELECT NOW();")).toBe("SELECT CURRENT_TIMESTAMP;");
  });

  test("converts CURDATE() to DATE('now')", () => {
    expect(mysqlToSQLiteParser("SELECT CURDATE();")).toBe("SELECT DATE('now');");
  });

  test("converts DATE_ADD with interval days", () => {
    expect(mysqlToSQLiteParser("SELECT DATE_ADD('2023-01-01', INTERVAL 7 DAY);"))
      .toBe("SELECT DATE('2023-01-01', '+7 day');");
  });

  test("converts DATE_SUB with interval days", () => {
    expect(mysqlToSQLiteParser("SELECT DATE_SUB('2023-01-01', INTERVAL 3 DAY);"))
      .toBe("SELECT DATE('2023-01-01', '-3 day');");
  });

  test("converts CONCAT into || operator", () => {
    expect(mysqlToSQLiteParser("SELECT CONCAT(first, ' ', last) FROM users;"))
      .toBe("SELECT first || ' ' || last FROM users;");
  });

  test("converts SUBSTRING to SUBSTR", () => {
    expect(mysqlToSQLiteParser("SELECT SUBSTRING(name, 2, 3) FROM users;"))
      .toBe("SELECT SUBSTR(name, 2, 3) FROM users;");
  });

  test("converts LEFT to SUBSTR", () => {
    expect(mysqlToSQLiteParser("SELECT LEFT(name, 4) FROM users;"))
      .toBe("SELECT SUBSTR(name, 1, 4) FROM users;");
  });

  test("converts RIGHT to SUBSTR with negative index", () => {
    expect(mysqlToSQLiteParser("SELECT RIGHT(name, 2) FROM users;"))
      .toBe("SELECT SUBSTR(name, -2) FROM users;");
  });

  // ---- Aggregate/Null handling ----
  test("converts IFNULL to COALESCE", () => {
    expect(mysqlToSQLiteParser("SELECT IFNULL(age, 0) FROM users;"))
      .toBe("SELECT COALESCE(age, 0) FROM users;");
  });

  test("converts AUTO_INCREMENT to AUTOINCREMENT", () => {
    expect(mysqlToSQLiteParser("id INT PRIMARY KEY AUTO_INCREMENT;"))
      .toBe("id INT PRIMARY KEY AUTOINCREMENT;");
  });

  test("removes ENGINE and DEFAULT CHARSET", () => {
    expect(
      mysqlToSQLiteParser("CREATE TABLE t (id INT) ENGINE=InnoDB DEFAULT CHARSET=utf8;")
    ).toBe("CREATE TABLE t (id INT);");
  });
});
