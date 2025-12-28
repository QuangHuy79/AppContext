// import { Guards } from "../RuntimeGuard";

// export function guardNetwork(snapshot) {
//   const net = snapshot.network;
//   if (!net) return false;

//   return Guards.boolean(net.isOnline, "network.isOnline", "RG-NET-01");
// }

export function guardNetwork(snapshot) {
  const online = snapshot?.network?.isOnline;

  if (typeof online !== "boolean") {
    console.error("[RG-NET-01] network.isOnline expected boolean", online);
    return false;
  }

  return true;
}
