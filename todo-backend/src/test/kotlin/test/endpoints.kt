package com.tsovedenski.todo.test

import com.tsovedenski.todo.models.Registration
import com.tsovedenski.todo.models.TodoId
import com.tsovedenski.todo.models.TodoPatch
import org.http4k.core.HttpHandler
import org.http4k.core.Method
import org.http4k.core.Method.*
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson

/**
 * Created by Tsvetan Ovedenski on 10/03/2020.
 */
fun HttpHandler.ping(): Response {
    val request = Request(Method.GET, "/ping")
    return this(request)
}

class Auth (private val handler: HttpHandler) : HttpHandler by handler {
    fun login(email: String, password: String): Response {
        val body = """{"email":"$email","password":"$password"}"""
        val request = Request(POST, "/auth/login").body(body)
        return this(request)
    }

    fun signup(email: String, password: String, name: String? = null): Response {
        val json = Jackson.asJsonString(Registration(email, password, name))
        val request = Request(POST, "/auth/signup").body(json)
        return this(request)
    }
}

val HttpHandler.auth get() = Auth(this)


class Todos (private val handler: HttpHandler) : HttpHandler by handler {
    fun findAll(): Response {
        val request = Request(GET, "/todos")
        return this(request)
    }

    fun patch(id: TodoId, patch: TodoPatch): Response {
        val json = Jackson.asJsonString(patch)
        val request = Request(PATCH, "/todos/$id").body(json)
        return this(request)
    }

    fun delete(id: TodoId): Response {
        val request = Request(DELETE, "/todos/$id")
        return this(request)
    }
}

val HttpHandler.todos get() = Todos(this)