export function assertPromiseIsRejected(result: PromiseSettledResult<unknown>): result is PromiseRejectedResult {
    return result.status === 'rejected';
}

export function assertPromiseIsFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
    return result.status === 'fulfilled';
}
