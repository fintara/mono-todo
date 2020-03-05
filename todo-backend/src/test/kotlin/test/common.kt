package com.tsovedenski.todo.test

import com.tsovedenski.todo.*
import com.tsovedenski.todo.database.ExposedTxProvider
import com.tsovedenski.todo.database.TxProvider
import org.http4k.core.HttpHandler
import java.time.Instant

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
fun createTestApp(
    config: Config = defaultConfig(),
    txProvider: TxProvider = createTestTxProvider(),
    instantProvider: Provider<Instant> = { Instant.now() }
): HttpHandler = App(
    config = config,
    txProvider = txProvider,
    instantProvider = instantProvider
).asRouter()

fun createTestTxProvider(): TxProvider {
    // since we are using H2, we can directly use that
    return ExposedTxProvider.create(DatabaseConfig.h2())
}