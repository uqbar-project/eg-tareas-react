import { useEffect } from "react"

export const useOnInit = (initialCallBack) => {
    useEffect(() => {
      initialCallBack()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])}