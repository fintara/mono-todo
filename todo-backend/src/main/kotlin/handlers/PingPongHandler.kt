package com.tsovedenski.todo.handlers

import com.tsovedenski.todo.Provider
import com.tsovedenski.todo.body
import com.tsovedenski.todo.bodyLens
import org.http4k.core.*
import java.time.Instant

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
class PingPongHandler (
    private val instantProvider: Provider<Instant>
) : HttpHandler {

    override fun invoke(request: Request): Response =
        Response(Status.OK).body(Pong(instantProvider().epochSecond))

    private data class Pong (val pong: Long)
}