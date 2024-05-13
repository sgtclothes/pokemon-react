/* eslint-disable react/prop-types */
export default function Pagination({ pagination, dispatch, isSubmitSearch }) {
    function handleClickNumberPage(i) {
        dispatch({ type: "SET_PAGINATION_CONFIG", payload: { ...pagination, cursor: i - 1 } });
    }
    function handleJumpToFirstPage() {
        dispatch({
            type: "SET_PAGINATION_CONFIG",
            payload: {
                ...pagination,
                cursor: 0,
                listNumberPage: Array(pagination.limitButton)
                    .fill(null)
                    .map((_, i) => i + 1),
            },
        });
    }
    function handleJumpToLastPage() {
        dispatch({
            type: "SET_PAGINATION_CONFIG",
            payload: {
                ...pagination,
                cursor: pagination.totalPage - 1,
                listNumberPage: Array(pagination.limitButton)
                    .fill(pagination.totalPage - pagination.limitButton + 1)
                    .map((n, i) => n + i),
            },
        });
    }
    function handleDecreaseNumberPage() {
        const listNumberPage = !pagination.listNumberPage.includes(pagination.cursor - 2)
            ? pagination.listNumberPage.map((n) => n - 1).includes(0)
                ? Array(pagination.limitButton)
                      .fill(null)
                      .map((_, i) => i + 1)
                : pagination.listNumberPage.map((n) => n - 1)
            : pagination.listNumberPage;
        dispatch({ type: "SET_PAGINATION_CONFIG", payload: { ...pagination, cursor: pagination.cursor - 1, listNumberPage: listNumberPage } });
    }
    function handleIncreaseNumberPage() {
        const listNumberPage = !pagination.listNumberPage.includes(pagination.cursor + 2)
            ? pagination.listNumberPage.map((n) => n + 1).includes(pagination.totalPage)
                ? Array(pagination.limitButton)
                      .fill(pagination.totalPage - pagination.limitButton + 1)
                      .map((n, i) => n + i)
                : pagination.listNumberPage.map((n) => n + 1)
            : pagination.listNumberPage;
        dispatch({
            type: "SET_PAGINATION_CONFIG",
            payload: { ...pagination, cursor: pagination.cursor + 1, listNumberPage: listNumberPage },
        });
    }
    return (
        <>
            {isSubmitSearch ? (
                ""
            ) : (
                <div className="pk-pagination">
                    <button onClick={handleJumpToFirstPage} disabled={pagination.cursor === 0 ? true : false} className={pagination.cursor === 0 ? "pk-disabled-button" : ""}>
                        &#60;&#60;
                    </button>
                    <button onClick={handleDecreaseNumberPage} disabled={pagination.cursor === 0 ? true : false} className={pagination.cursor === 0 ? "pk-disabled-button" : ""}>
                        &#60;
                    </button>
                    {pagination.listNumberPage.map((n) => (
                        <button className={pagination.cursor === n - 1 ? "active" : ""} onClick={() => handleClickNumberPage(n)} key={n}>
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={handleIncreaseNumberPage}
                        disabled={pagination.cursor + 1 === pagination.totalPage ? true : false}
                        className={pagination.cursor + 1 === pagination.totalPage ? "pk-disabled-button" : ""}
                    >
                        &#62;
                    </button>
                    <button
                        onClick={handleJumpToLastPage}
                        disabled={pagination.cursor + 1 === pagination.totalPage ? true : false}
                        className={pagination.cursor + 1 === pagination.totalPage ? "pk-disabled-button" : ""}
                    >
                        &#62;&#62;
                    </button>
                </div>
            )}
        </>
    );
}
