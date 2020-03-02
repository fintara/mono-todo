package com.tsovedenski.todo

import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status
import org.http4k.server.Jetty
import org.http4k.server.asServer

/**
 * Created by Tsvetan Ovedenski on 02/03/2020.
 */
fun main() {
    val app = { req: Request -> Response(Status.OK).body("Hello") }
    app.asServer(Jetty(8080)).start().block()
}