package com.tsovedenski.todo

import com.tsovedenski.todo.test.assertThat
import com.tsovedenski.todo.test.createTestApp
import org.http4k.core.Method
import org.http4k.core.Request
import org.junit.jupiter.api.Test
import java.time.Instant

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
class PingPongTests {

    @Test
    fun `ping pongs`() {
        val seconds = 1583443142L
        val app = createTestApp(instantProvider = { Instant.ofEpochSecond(seconds) })
        val request = Request(Method.GET, "/ping")

        assertThat(app(request)) {
            status.is2xx
            json {
                isObject.containsKey("pong")
                inPath("$.pong").isNumber.extracting { it.toLong() }.isEqualTo(seconds)
            }
        }
    }
}