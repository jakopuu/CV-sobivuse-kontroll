-- analyses per day
select created_at::date as day, count(*) as analyses
from analyses group by 1 order by 1 desc;

-- average match score
select round(avg(match_score), 1) as avg_score from analyses;

-- feedback: share of helpful votes
select count(*) as total,
       round(100.0 * count(*) filter (where helpful) / nullif(count(*), 0), 1) as helpful_pct
from feedback;

-- emails collected
select count(*) as emails from waitlist;