package com.tsovedenski.todo

import com.tsovedenski.todo.Either.Left
import com.tsovedenski.todo.Either.Right
import java.time.Instant

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

typealias Provider <T> = () -> T
typealias InstantProvider = Provider<Instant>


infix fun <A, B, C> ((A) -> B).andThen(f: (B) -> C): (A) -> C = { a -> f(this(a)) }


sealed class Either <out L, out R> {
    data class Left <out T> (val value: T) : Either<T, Nothing>()
    data class Right <out T> (val value: T) : Either<Nothing, T>()

    inline fun <T> fold(crossinline left: (L) -> T, crossinline right: (R) -> T): T = when (this) {
        is Left  -> left(value)
        is Right -> right(value)
    }
}

fun <L, R, T> Either<L, R>.map(transform: (R) -> T): Either<L, T> =
    fold(::Left, transform andThen ::Right)

fun <L, R, T> Either<L, R>.mapLeft(transform: (L) -> T): Either<T, R> =
    fold(transform andThen ::Left, ::Right)

fun <L, R, T> Either<L, R>.flatMap(next: (R) -> Either<L, T>): Either<L, T> =
    fold(::Left, next)

fun <L, R> Either<L, R>.getOrThrow(e: (L) -> Throwable): R =
    fold({ throw e(it) }, { it })

fun <L, R> Either<L, R>.swap(): Either<R, L> =
    fold(::Right, ::Left)

fun <T> T.left() = Left(this)
fun <T> T.right() = Right(this)