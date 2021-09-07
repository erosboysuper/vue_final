import { Ref, ref } from 'vue'
import { Pagination } from '@/models/pagination.model'
import { listItemsCount } from './global';

const paginationStore: Ref<Pagination[]> = ref([])
const showItems = 5;
let maxPage = 0;

export default function usePagination() {
  const setPagination = (num: number, query: string) => {
    query = `/tasks-search#/${query}`
    let endPage;

    paginationStore.value = [];

    if (num < 1) num = 1;

    const startPage = Math.floor((num - 1) / showItems) * showItems;

    endPage = startPage + showItems;
    endPage > maxPage ? endPage = maxPage : null;

    paginationStore.value.push({ title: '<<', page: 1, active: false, url: query.replace(/skip=([0-9])*/, '') + `skip=0` })

    let n = num - 1;
    if (n < 1) n = 1;

    paginationStore.value.push({ title: '<', page: n, active: false, url: query.replace(/skip=([0-9])*/, '') + `skip=${(n - 1) * listItemsCount}` })


    for (let index = startPage + 1; index <= endPage; index++) {
      num === index ? paginationStore.value.push({
        title: index.toString(), page: index, active: true, url: query.replace(/skip=([0-9])*/, '') + `skip=${(index - 1) * listItemsCount}`
      }) :
        paginationStore.value.push({
          title: index.toString(), page: index, active: false, url: query.replace(/skip=([0-9])*/, `skip=${(index - 1) * listItemsCount}`)
        })
    }

    if (++num > maxPage) num = maxPage

    paginationStore.value.push({ title: '>', page: num, active: false, url: query.replace(/skip=([0-9])*/, '') + `skip=${(num - 1) * listItemsCount}` });
    paginationStore.value.push({ title: '>>', page: maxPage, active: false, url: query.replace(/skip=([0-9])*/, '') + `skip=${(maxPage - 1) * listItemsCount}` });
  }

  const setPageLength = (pageNumber: number) => {
    maxPage = Math.floor(pageNumber / listItemsCount) + 1
  }

  const getMaxPage = () => {
    return maxPage
  }

  return {
    setPagination,
    paginationStore,
    getMaxPage,
    setPageLength,
  }
}