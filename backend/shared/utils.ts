export const generate_full_routes = (routes_base: { [key: string]: any }) => {
  let accumulator: { [key: string]: any } = {};
  for (const key_base_route in routes_base) {
    let { ENDPOINT, ...current_sub_routes } = routes_base[key_base_route];
    accumulator[key_base_route] = { ENDPOINT };
    for (const key_end_route in current_sub_routes) {
      accumulator[key_base_route][key_end_route] =
        ENDPOINT + current_sub_routes[key_end_route];
    }
  }
  return accumulator;
};

export const isSameSimpleObj = (o1: any, o2: any) => {
  let o1Keys = Object.keys(o1);
  let o2Keys = Object.keys(o2);
  if (o1Keys.length !== o2Keys.length) return false;
  for (var i = 0; i < o1Keys.length; i++) {
    let o1Keys = Object.keys(o1);
    if (o1[o1Keys[i]] !== o2[o2Keys[i]]) return false;
    if (o1Keys[i] !== o2Keys[i]) return false;
  }
  return true;
};
