package com.tsovedenski.todo.test

import com.tsovedenski.todo.Either

/**
 * Created by Tsvetan Ovedenski on 28/05/2020.
 */
fun <L, R> assertLeft(either: Either<L, R>, assertion: (L) -> Boolean = { true }) = either.fold(
    { assert(assertion(it)) },
    { throw AssertionError("Unexpected Right") }
)

fun <L, R> assertRight(either: Either<L, R>, assertion: (R) -> Boolean = { true }) = either.fold(
    { throw AssertionError("Unexpected Left") },
    { assert(assertion(it)) }
)