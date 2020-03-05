package com.tsovedenski.todo

import org.http4k.cloudnative.env.Environment
import org.http4k.cloudnative.env.EnvironmentKey
import org.http4k.cloudnative.env.Port
import org.http4k.lens.boolean
import org.http4k.lens.nonEmptyString
import org.http4k.lens.port
import org.http4k.lens.string

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

data class Config (
    val server: ServerConfig,
    val database: DatabaseConfig
)

data class ServerConfig (
    val port: Int
)

data class DatabaseConfig (
    val url: String,
    val driver: String,
    val user: String = "",
    val password: String = "",
    val logQueries: Boolean = true
) {
    companion object {
        fun h2() = DatabaseConfig(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1",
            driver = "org.h2.Driver",
            user = "root"
        )
    }
}

fun defaultConfig() = Config(
    server = ServerConfig(
        port = 8080
    ),
    database = DatabaseConfig.h2()
)

@Suppress("ClassName")
object cloudnativeConfig {
    private object keys {
        object server {
            private const val prefix = "server."
            val port = EnvironmentKey.port().required("${prefix}port")
        }
        object database {
            private const val prefix = "database."
            val url = EnvironmentKey.nonEmptyString().required("${prefix}url")
            val driver = EnvironmentKey.nonEmptyString().required("${prefix}driver")
            val user = EnvironmentKey.string().required("${prefix}user")
            val password = EnvironmentKey.string().required("${prefix}password")
            val logQueries = EnvironmentKey.boolean().required("${prefix}log-queries")
        }
    }

    operator fun invoke(environment: Environment, overrides: Config): Config {
        val env = environment overrides overrides.toEnv()
        return Config(
            server = ServerConfig(
                port = env[keys.server.port].value
            ),
            database = DatabaseConfig(
                url = env[keys.database.url],
                driver = env[keys.database.driver],
                user = env[keys.database.user],
                password = env[keys.database.password]
            )
        )
    }

    private fun Config.toEnv() = Environment.defaults(
        keys.server.port of Port(server.port),

        keys.database.url of database.url,
        keys.database.driver of database.driver,
        keys.database.user of database.user,
        keys.database.password of database.password,
        keys.database.logQueries of database.logQueries
    )
}
