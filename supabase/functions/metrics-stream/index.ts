import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/** Server-Sent Events stream of live cluster telemetry. */
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

Deno.serve((req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const url = new URL(req.url);
  const interval = clamp(Number(url.searchParams.get('interval') ?? 1500) || 1500, 500, 10000);

  let cpu = 38 + Math.random() * 14;
  let memory = 52 + Math.random() * 10;
  let requests = 1400;
  let latency = 84;
  let timer: number | undefined;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const tick = () => {
        cpu = clamp(cpu + (Math.random() - 0.48) * 9, 6, 96);
        memory = clamp(memory + (Math.random() - 0.5) * 5, 12, 94);
        requests = Math.round(clamp(requests + (Math.random() - 0.47) * 320, 120, 5200));
        latency = Math.round(clamp(latency + (Math.random() - 0.5) * 22, 18, 480));
        const payload = {
          t: Date.now(),
          cpu: Number(cpu.toFixed(2)),
          memory: Number(memory.toFixed(2)),
          requests,
          latency,
        };
        try {
          controller.enqueue(encoder.encode(`event: metric\ndata: ${JSON.stringify(payload)}\n\n`));
        } catch {
          if (timer) clearInterval(timer);
        }
      };
      tick();
      timer = setInterval(tick, interval);
      req.signal.addEventListener('abort', () => {
        if (timer) clearInterval(timer);
        try {
          controller.close();
        } catch { /* already closed */ }
      });
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
});