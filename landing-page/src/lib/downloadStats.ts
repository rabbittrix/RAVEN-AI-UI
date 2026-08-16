const STORAGE_KEY = "raven-ai.download-stats.v1";

export type AssetDownloadMap = Record<string, number>;

export function readStoredDownloads(): AssetDownloadMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as AssetDownloadMap;
  } catch {
    return {};
  }
}

export function persistDownload(assetName: string): AssetDownloadMap {
  const current = readStoredDownloads();
  const next = { ...current, [assetName]: (current[assetName] ?? 0) + 1 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function fetchGlobalDownloadStats(): Promise<AssetDownloadMap> {
  try {
    const res = await fetch(
      `${import.meta.env.BASE_URL}download-stats.json?t=${Date.now()}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return {};
    const data = (await res.json()) as { assets?: AssetDownloadMap };
    return data.assets ?? {};
  } catch {
    return {};
  }
}

export function assetDownloadTotal(
  assetName: string,
  manifestCount: number,
  global: AssetDownloadMap,
  pending: AssetDownloadMap,
): number {
  const server = Math.max(manifestCount, global[assetName] ?? 0);
  return server + (pending[assetName] ?? 0);
}

const DISPATCH_REPO =
  import.meta.env.VITE_DOWNLOAD_DISPATCH_REPO ?? "rabbittrix/RAVEN-AI";

export async function notifyGlobalDownload(assetName: string): Promise<void> {
  const token = import.meta.env.VITE_DOWNLOAD_DISPATCH_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.github.com/repos/${DISPATCH_REPO}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        event_type: "record-download",
        client_payload: { asset: assetName },
      }),
      keepalive: true,
    });
  } catch {
    /* offline or blocked — local pending count still applies */
  }
}
