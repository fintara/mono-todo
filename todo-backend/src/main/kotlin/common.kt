package com.tsovedenski.todo

import org.http4k.core.Response
import org.http4k.core.with
import org.http4k.format.Jackson
import java.util.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

fun String.toUUID(): UUID? =
    try {
        UUID.fromString(this)
    } catch (e: Throwable) {
        null
    }

inline fun <reified T : Any> bodyLens() = Jackson.autoBody<T>().toLens()

inline fun <reified T : Any> Response.body(item: T): Response = with(bodyLens<T>() of item)