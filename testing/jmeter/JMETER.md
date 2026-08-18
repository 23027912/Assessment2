JMeter Load Testing — RSS Server
`rss-load-test.jmx` is a staged load test against the RSS Server API, with five
Thread Groups already configured: x1, x10, x100, x1000, x10000, each hitting
`GET /api/feeds` and `GET /api/health`.
1. Point it at your server
Open the file in JMeter (`File > Open`), then edit the User Defined Variables on the
Test Plan itself:
Variable	Set to
`PROTOCOL`	`http`
`HOST`	`localhost` (local testing) or your EC2 public IP (remote testing)
`PORT`	`4000` (local `npm run dev`) or `4080` (your EC2 mapping)
2. Run one stage at a time
Only one Thread Group should be enabled at once — by default, x1 is enabled and the
rest are disabled (greyed out in the tree). To run the next stage:
Right-click the currently enabled Thread Group → Disable
Right-click the next stage → Enable
Clear previous results: `Run > Clear All Results` (or the broom icon)
`Run > Start` (or the green ▶ button)
Do this for x1 → x10 → x100 → x1000, recording the Summary Report / Aggregate Report
numbers after each run (screenshot them for your video and write-up).
3. x10000 — use the command line, not the GUI
At 10,000 threads, the JMeter GUI itself becomes a bottleneck (rendering results eats
the memory and CPU you want going toward generating load). Run this stage headless:
```bash
jmeter -n -t testing/jmeter/rss-load-test.jmx \
  -Jthreads=10000 \
  -l testing/jmeter/results/x10000-results.jtl \
  -e -o testing/jmeter/results/x10000-report
```
(Make sure only the x10000 Thread Group is enabled in the file before running this, or
edit the `.jmx` directly and set the other four to `enabled="false"`, which they already
are by default.) The `-e -o` flags generate an HTML dashboard report you can screenshot
for the video. If it errors on memory, increase JMeter's heap first:
```bash
export JVM_ARGS="-Xms2g -Xmx4g"
```
4. What to look for in the results
The Summary/Aggregate Report gives you, per sampler:
Average / Median / 90th percentile response time (ms) — how long requests take
Throughput — requests per second the server actually sustained
Error % — proportion of failed requests (timeouts, 5xx errors, connection refused)
5. Writing up "how the system behaves under different loads"
Fill this in after running all five stages — this is the analysis the brief asks for:
Stage	Avg response (ms)	Throughput (req/s)	Error %	Notes
x1				
x10				
x100				
x1000				
x10000				
Things worth specifically calling out, if you observe them:
Where response time starts climbing non-linearly — that's usually where you've
found the system's practical ceiling (often the Postgres connection pool, or the
single-container api service running out of CPU).
Where errors start appearing — connection refused / timeouts usually mean the
api container or Postgres itself is saturated, not the network.
Whether /api/health stays fast even when /api/feeds slows down — a good sign,
since it means the app itself isn't fully wedged, just the heavier DB query.
This is a single-container, single-instance deployment (no load balancer, no read
replica, no connection pooler like PgBouncer) — if x1000/x10000 shows serious
degradation, that's expected and worth saying explicitly: it demonstrates you
understand why it degrades, not just that it did.