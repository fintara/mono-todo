package com.tsovedenski.todo.database

import com.tsovedenski.todo.DatabaseConfig
import com.tsovedenski.todo.database.repositories.ExposedTodoRepository
import com.tsovedenski.todo.database.repositories.ExposedUserRepository
import com.tsovedenski.todo.database.repositories.TodoRepository
import com.tsovedenski.todo.database.repositories.UserRepository
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Slf4jSqlDebugLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */
interface TxManager <out R> {
    fun <T> tx(block: R.() -> T): T
    operator fun <T> invoke(block: R.() -> T): T = tx(block)
}

interface TxProvider {
    val users: TxManager<UserRepository>
    val todos: TxManager<TodoRepository>
}

class ExposedTxProvider (
    private val database: Database,
    private val enableLogging: Boolean
) : TxProvider {

    override val users = of(ExposedUserRepository)
    override val todos = of(ExposedTodoRepository)

    private fun <R> of(repository: R): TxManager<R> = object : TxManager<R> {
        override fun <T> tx(block: R.() -> T): T =
            transaction(database) {
                if (enableLogging) addLogger(Slf4jSqlDebugLogger)
                block(repository)
            }
    }

    companion object {
        fun create(config: DatabaseConfig): ExposedTxProvider {
            val hikari = HikariConfig().apply {
                jdbcUrl = config.url
                driverClassName = config.driver
                username = config.user
                password = config.password
            }

            val datasource = HikariDataSource(hikari)

            val database = Database.connect(datasource)

            transaction(database) {
                SchemaUtils.create(
                    Users,
                    Todos
                )
            }

            return ExposedTxProvider(database, config.logQueries)
        }
    }
}
