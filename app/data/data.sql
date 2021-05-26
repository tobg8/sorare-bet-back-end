BEGIN;
SET client_encoding = 'UTF-8';

INSERT INTO "league" (
    "game_week",
    "duration",
    "open_date",
    "close_date",
    "max_places",
    "open",
    "status"
)
 VALUES
-- (166, '14-18-may', '2021-05-18T17:00:00Z', '2021-05-21T04:00:00Z', 200, FALSE, 'closed'),
-- (167, '19-21-may', '2021-05-14T17:00:00Z', '2021-05-18T04:00:00Z', 200, FALSE, 'started'),
(170, '21-25-may', '2021-05-18T17:00:00Z', '2021-05-21T04:00:00Z', 200, TRUE, 'opened');

INSERT INTO "registration" (
    "manager_name",
    "manager_id",
    "league_id"
) VALUES
('to88','id to88', 2),
('ok', 'id ok ', 2);

INSERT INTO "card" (
    "slug",
    "picture_url",
    "registration_id"
) VALUES
('yuta-matsumura-2020-rare-38','ok', 2),
('thibaut-courtois-2020-common-b53109ab-0dd1-4400-a982-2cbf10723312','ok', 2),
('laurtaro-giaccone-2020-rare-2','ok', 2),
('laurtaro-giaccone-2020-rare-2','ok', 2),
('david-ospina-ramirez-2020-common-973982a6-755c-453b-81f1-ece786217a6b','ok', 2);
-- ('yuta-matsumura-2020-rare-38', 6),
-- ('ho-ik-jang-2021-common-d6eda32f-f7ac-4522-af70-7741c10c35bf', 6),
-- ('maarten-stekelenburg-2020-common-dbcbe8a9-d41f-4cba-8947-fb9e0864953a', 6),
-- ('said-bakari-2020-rare-57', 6),
-- ('leandro-daniel-paredes-2020-common-bc425664-0f84-4c90-8e63-1253c1c8910c', 6),
-- ('jonathan-david-2020-common-606d871c-1931-4b01-8cea-45a2f570a7fe', 7),
-- ('hae-seong-an-2021-rare-11', 7),
-- ('georginio-wijnaldum-2020-common-64b82b6b-4dca-4338-a82c-c75f11a8e9be', 7),
-- ('marcos-aoas-correa-2020-common-1892e73f-eeb1-4feb-b6fe-5eb7c9cc5172', 7),
-- ('pape-gueye-2020-rare-24', 7),
-- ('marcos-aoas-correa-2020-common-a50f9f3b-3f73-4450-92a1-146bebce672e', 8),
-- ('pape-gueye-2020-rare-24', 8),
-- ('andrew-robertson-2020-common-dd2f1b20-a4ce-4aab-91b6-67358fceabb6', 8),
-- ('steve-mandanda-2020-common-67db8351-a48e-4968-b197-7a4c6112fb1c', 8),
-- ('abdou-diallo-2020-common-8c15e5d8-bb7b-49a4-a0d6-ff0217e4973d', 8);







COMMIT;