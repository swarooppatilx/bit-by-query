module.exports = function mysqlToSQLiteParser(query) {
  if (!query || typeof query !== "string") return query;
  let q = query;

  q = q.replace(/\bNOW\(\)/gi, "CURRENT_TIMESTAMP");
  q = q.replace(/\bCURDATE\(\)/gi, "DATE('now')");
  q = q.replace(/\bCURTIME\(\)/gi, "TIME('now')");
  q = q.replace(/\bUTC_DATE\(\)/gi, "DATE('now')");
  q = q.replace(/\bUTC_TIME\(\)/gi, "TIME('now')");

  q = q.replace(
    /DATE_ADD\(([^,]+),\s*INTERVAL\s+(\d+)\s+DAY\)/gi,
    "DATE($1, '+$2 day')"
  );

  q = q.replace(
    /DATE_SUB\(([^,]+),\s*INTERVAL\s+(\d+)\s+DAY\)/gi,
    "DATE($1, '-$2 day')"
  );

  q = q.replace(/\bCONCAT\(([^)]+)\)/gi, (match, args) => {
    return args.split(",").map(a => a.trim()).join(" || ");
  });


  q = q.replace(
    /\bSUBSTRING\(([^,]+),\s*([^,]+),\s*([^)]+)\)/gi,
    "SUBSTR($1, $2, $3)"
  );

  q = q.replace(/\bLEFT\(([^,]+),\s*([^)]+)\)/gi, "SUBSTR($1, 1, $2)");

  q = q.replace(/\bRIGHT\(([^,]+),\s*([^)]+)\)/gi, "SUBSTR($1, -$2)");

  q = q.replace(/\bLENGTH\(/gi, "LENGTH(");

  q = q.replace(/\bIFNULL\(/gi, "COALESCE(");

  q = q.replace(/\bAUTO_INCREMENT\b/gi, "AUTOINCREMENT");

  q = q.replace(/ENGINE=\w+\s*/gi, "");
  q = q.replace(/DEFAULT CHARSET=\w+\s*/gi, "");

  q = q.replace(/\s*;/g, ";");  
  return q.trim();
};
