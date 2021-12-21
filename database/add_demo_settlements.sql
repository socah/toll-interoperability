INSERT INTO Settlement (settlementID, dateFrom, dateTo, amount, operatorCredited, operatorDebited) VALUES
(1, "2020-01-01", "2020-02-01", 123, "aodos", "gefyra"),
(2, "2020-05-01", "2020-06-01", 456, "nea_odos", "gefyra"),
(3, "2020-09-01", "2020-010-01", 789, "gefyra", "olympia_odos"),
(4, "2020-04-01", "2020-05-01", 999, "olympia_odos", "egnatia");


UPDATE Pass SET settlementID = 1 WHERE passID = 'AAF5102386';
UPDATE Pass SET settlementID = 1 WHERE passID = 'AAB7311258';
UPDATE Pass SET settlementID = 1 WHERE passID = 'AAK2274580';
