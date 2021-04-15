export type Indexable = { [index: string]: any };
export interface Dict<T> {
  [index: string]: T;
}
export function dictComp<ListT,ValueT>(extractorFn : (a : ListT) => [string,ValueT],list : ListT[]) : Dict<ValueT> {
    const initialObject : Dict<ValueT> = {}
    list.forEach(element => {
        const [key,val] = extractorFn(element)
        initialObject[key] = val
    })
    return initialObject

}
