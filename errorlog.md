PS D:\New ArcInterview - Talent-flow-ATS\talent-flow-ats> docker compose down -v
>> docker compose up -d --build
>> docker compose --profile migrate run --rm migrations
[+] down 1/1
 ✔ Volume talent-flow-ats_postgres_data Removed                                                                                              0.0s
#1 [internal] load local bake definitions
#1 reading from stdin 592B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 932B done
#2 DONE 0.0s

#3 [auth] library/python:pull token for registry-1.docker.io
#3 DONE 0.0s

#4 [internal] load metadata for docker.io/library/python:3.11-slim
#4 ERROR: failed to authorize: failed to fetch oauth token: Post "https://auth.docker.io/token": tls: failed to verify certificate: x509: certificate signed by unknown authority
------
 > [internal] load metadata for docker.io/library/python:3.11-slim:
------
[+] up 0/1
 - Image talent-flow-ats-backend Building                                                                                                    1.0s
Dockerfile:1

--------------------

   1 | >>> FROM python:3.11-slim

   2 |     

   3 |     WORKDIR /backend

--------------------

failed to solve: failed to fetch oauth token: Post "https://auth.docker.io/token": tls: failed to verify certificate: x509: certificate signed by unknown authority



View build details: docker-desktop://dashboard/build/default/default/wxrl4y4b0c8t50z8psne3pgfa


What's next:
    Debug this Compose error with Gordon → docker ai "help me fix this compose error"
    Filter, search, and stream logs from all your Compose services
    in one place with Docker Desktop's Logs view. docker-desktop://dashboard/logs?appId=talent-flow-ats
[+]  3/3t 3/33
 ✔ Network talent-flow-ats_default      Created                                                                                              0.0s
 ✔ Volume talent-flow-ats_postgres_data Created                                                                                              0.0s
 ✔ Container talent-flow-postgres       Started                                                                                              0.2s
Container talent-flow-postgres Waiting 
Container talent-flow-postgres Healthy 
Container talent-flow-ats-migrations-run-885b17e477b8 Creating 
Container talent-flow-ats-migrations-run-885b17e477b8 Created 
=================================================
🚀 Database Migration Utility
Action: upgrade
Revision: head
=================================================
🐍 Using Python: python3
⬆️ Running upgrade...
2026-05-26 06:07:49 [INFO] alembic.runtime.migration - Context impl PostgresqlImpl.
2026-05-26 06:07:49 [INFO] alembic.runtime.migration - Will assume transactional DDL.
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade  -> 904ef225a4d3, initial schema
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 904ef225a4d3 -> a16a06a78ad1, update the questions table schema and delete options table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade a16a06a78ad1 -> e9c4f33e04b9, added answers and classification table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade e9c4f33e04b9 -> f663a63eefc8, create paper table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade f663a63eefc8 -> 6ccb1459372e, add unique constraint for code column in classification table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 6ccb1459372e -> bf8fe6b7d98a, create attempt table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade bf8fe6b7d98a -> 8255fabdad40, Add duplicate tracking tables
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 8255fabdad40 -> e887446c317b, Add match_details to duplicate_user_matches
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade e887446c317b -> e09debccb6dd, create_department_table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade e09debccb6dd -> e4adefe9fcb0, add_new_columns_to_papers
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade e4adefe9fcb0 -> 1043a67c6410, add_status_time_marks_to_papers
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 1043a67c6410 -> dba95901fa50, rearrange_paper_columns_and_remove_obsolete
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade dba95901fa50 -> 7ce554207c66, Seed classifications in new sequence
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 7ce554207c66 -> bbebf9c48f6f, latest_db_changes
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade bbebf9c48f6f -> d1e2f3a4b5c6, add_performance_indexes_for_concurrent_candidates
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade bbebf9c48f6f -> c2f9d6a8b321, create_paper_assignments_table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade c2f9d6a8b321 -> 21aac8226726, add department_id and test_level_id to paper_assignments
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 21aac8226726 -> 3f9d60802d28, add is_attempted to paper_assignments
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 3f9d60802d28 -> 5b7f0f5e0aa1, rename attempt answers to responses
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 5b7f0f5e0aa1 -> 3adee8ecf3e9, add manual marks
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 3adee8ecf3e9 -> b4e828498495, add_grade_settings
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade b4e828498495 -> 55ba927acb0f, update_exclusivity_data
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 55ba927acb0f -> 24413fcd3336, add_grade_snapshot_and_audit_log
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 24413fcd3336 -> a9f3c2d1e857, create_interview_records_table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade a9f3c2d1e857 -> c8f42d8e1b20, drop paper grade setting logs
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade c8f42d8e1b20 -> f9c3d01ae46e, drop_old_interview_attempt_tables
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade f9c3d01ae46e -> 10c5585e78a2, drop_paper_audit_logs
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 10c5585e78a2 -> 805da4a656f5, add department id to users
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 805da4a656f5 -> 8e5e9518d410, add test_level_id to users
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 8e5e9518d410 -> a754d739dea7, add_auto_assignment_rules
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade a754d739dea7 -> b7c3d2e1f9a0, add interview columns to user_details
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade b7c3d2e1f9a0 -> c8d7f6e5d4c3, seed admin user
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade c8d7f6e5d4c3 -> 28004a445359, add process_status to users
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 28004a445359 -> b8b26792b253, create_interview_evaluations_table
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade b8b26792b253 -> 7a5eaaff678c, add_user_id_to_notifications
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade 7a5eaaff678c, d1e2f3a4b5c6 -> b78405ff304e, merge heads
2026-05-26 06:07:50 [INFO] alembic.runtime.migration - Running upgrade b78405ff304e -> 3edb2b743922, add_active_duration_seconds_to_interview_records
=================================================
✅ Migration command executed successfully
=================================================
PS D:\New ArcInterview - Talent-flow-ATS\talent-flow-ats> python3 --version
Python 3.14.5
PS D:\New ArcInterview - Talent-flow-ATS\talent-flow-ats> 