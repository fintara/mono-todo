package com.tsovedenski.todo.test

import net.javacrumbs.jsonunit.assertj.JsonAssert
import net.javacrumbs.jsonunit.assertj.JsonAssertions
import org.assertj.core.api.AbstractStringAssert
import org.assertj.core.api.ObjectAssert
import org.http4k.core.Response
import org.http4k.core.Status

/**
 * Created by Tsvetan Ovedenski on 05/03/20.
 */
fun assertResponse(response: Response) = ResponseAssertion(response)
fun assertResponse(response: Response, body: ResponseAssertion.() -> Unit) = with(ResponseAssertion(response), body)

class ResponseAssertion (response: Response) : ObjectAssert<Response>(response) {
    val status = StatusAssertion(response.status)
    fun status(body: StatusAssertion.() -> Unit) = with(status, body)

    val json: JsonAssert.ConfigurableJsonAssert = JsonAssertions.assertThatJson(response.bodyString())
    fun json(body: JsonAssert.ConfigurableJsonAssert.() -> Unit) = with(json, body)
}

fun assertStatus(status: Status) = StatusAssertion(status)

class StatusAssertion (actual: Status) : ObjectAssert<Status>(actual) {
    val is2xx: AbstractStringAssert<*> get() = assertCodeStartsWith("2")
    val is4xx: AbstractStringAssert<*> get() = assertCodeStartsWith("4")
    val is5xx: AbstractStringAssert<*> get() = assertCodeStartsWith("5")

    private fun assertCodeStartsWith(value: String): AbstractStringAssert<*> =
        extracting(Status::code).asString().startsWith(value)
}