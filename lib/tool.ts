export const parseURLSearch: Function = (
  serach: string = window.location.search,
): object => {
  const searchs = {};

  if (serach.length) {
    if (serach[0] === '?') serach = serach.slice(1);

    const kvs: string[] = serach.split('&');
    kvs.forEach((kv: string): void => {
      const skv: string[] = kv.split('=');
      searchs[skv[0]] = decodeURIComponent(skv[1]);
    });
  }

  return searchs;
};
