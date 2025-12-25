import { Guards } from "../RuntimeGuard";

export function guardNetwork(snapshot) {
  const net = snapshot.network;
  if (!net) return false;

  return Guards.boolean(net.isOnline, "network.isOnline", "RG-NET-01");
}
