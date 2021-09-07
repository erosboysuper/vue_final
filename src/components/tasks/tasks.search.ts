import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { listItemsCount } from '@/store/global';
import tasksListController from '@/middleware/controllers/tasksListController';
import { TasksSearchParam } from '@/models/tasks.model';

let interval = 0;

export default function useTasks() {
    const tasksList = tasksListController()
    const router = useRouter()

    const calcQuery = (query: string) => {
        return query.split('#/')[1]
    }

    const listQuery = reactive<TasksSearchParam>({
        limit: 6,
        platforms: [],
        keywords: [],
        budgetGreaterEqual: null,
        budgetLowerEqual: null,
        olderThanId: '',
        newerThanId: '',
        skip: 0
    })

    const getLists = (query: string, page: number) => {
        tasksList.getTasksList(query, page);
    }

    const search = (page: number) => {
        let makeQuery = '/tasks-search#/'
        if (page === 0) {
            // initial
            makeQuery += `limit=${listQuery.limit}&`
            if (listQuery.platforms?.length) {
                listQuery.platforms.map((data) => {
                    makeQuery += `platforms=${data}&`
                })
            }
            if (listQuery.keywords?.length) {
                listQuery.keywords.map((data) => {
                    makeQuery += `keywords=${data}&`
                })
            }
            if (listQuery.budgetGreaterEqual) makeQuery += `budgetGreaterEqual=${listQuery.budgetGreaterEqual}&`
            if (listQuery.budgetLowerEqual) makeQuery += `budgetLowerEqual=${listQuery.budgetLowerEqual}&`
            if (listQuery.olderThanId) makeQuery += `olderThanId=${listQuery.olderThanId}&`
            if (listQuery.newerThanId) makeQuery += `newerThanId=${listQuery.newerThanId}&`
            makeQuery += `skip=${listQuery.skip}&`

            makeQuery = makeQuery.substr(0, makeQuery.length - 1)
            router.push(makeQuery)
        } else {
            makeQuery = window.location.hash
        }

        getLists(calcQuery(makeQuery), page)
    }

    const init = () => {
        let query;

        if (window.location.hash.length < 2) {
            query = '/tasks-search#/limit=6&skip=0'
        } else {
            query = window.location.hash
            query = query.replace(/limit=([0-9])*/, `limit=6`)
        }

        clearInterval(interval)

        getLists(calcQuery(query), 0);

        return;
        interval = setInterval(() => {
            console.log("test");
        }, 60000);
    }

    return {
        getLists,
        listQuery,
        init,
        search
    }
}
