package com.tsovedenski.todo

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

typealias Provider <T> = () -> T

fun <A> id(): (A) -> A = { it }

fun <A, B> const(a: A): (B) -> A = { a }

infix fun <A, B, C> ((A) -> B).andThen(f: (B) -> C): (A) -> C = { a -> f(this(a)) }

infix fun <A, B, C> ((A) -> B).replaceWith(c: C): (A) -> C = this andThen const(c)

fun <A, B> ((A) -> B).asUnit(): (A) -> Unit = this replaceWith Unit