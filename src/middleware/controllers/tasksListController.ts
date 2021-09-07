import api from '@/services/api'
import useTasksStore from '@/store/tasks'
import usePagination from '@/store/pagination'
import { listItemsCount } from '@/store/global'
import { TasksGetFromDatabaseInfo } from '@/models/tasks.model'

const { setTasksList, getLists } = useTasksStore();
const { setPageLength, getMaxPage } = usePagination();

const getTasksList = async (query: string, page: number) => {
  let flag = true, first = false
  if (page) {
    const searchLists = Object.keys(getLists())
    let limit = 0;

    if (getMaxPage() >= page + 1)
      if (!searchLists.filter(key => key === (page + 1).toString()).length) {
        query = query.replace(/skip=([0-9])*/, `skip=${(page) * listItemsCount}`)
        limit++
      }
    if (!searchLists.filter(key => key === page.toString()).length) {
      query = query.replace(/skip=([0-9])*/, `skip=${(page - 1) * listItemsCount}`)
      limit++
    }

    switch (limit) {
      case 0:
        setTasksList(null, page, query, false)
        return
      case 1:
        query = query.replace(/limit=([0-9])*/, `limit=3`)
        break
      default:
        query = query.replace(/limit=([0-9])*/, `limit=6`)
        break;
    }
    flag = false
  } else {
    first = true
    const buffer = query.split('&');
    buffer.map(data => {
      if (-1 < data.indexOf('skip=')) {
        const skip = Number(data.replace('skip=', ''))

        page = Math.floor(skip / listItemsCount) + 1
      }
    })
  }

  return await api.get<TasksGetFromDatabaseInfo>(`/tasks?${query}`)
    .then((response) => {
      if (flag) setPageLength(response.data.count + (page - 1) * listItemsCount)
      setTasksList(response.data, page, query, first)
      return response
    }).catch((error) => {
      console.log(error)
      return;
    })
}

export default function tasksListController() {
  return {
    getTasksList,
  }
}
