package com.tsovedenski.todo

import com.tsovedenski.todo.models.Credentials
import com.tsovedenski.todo.models.UserEntity
import com.tsovedenski.todo.models.UserId
import org.mindrot.jbcrypt.BCrypt
import java.util.*

/**
 * Created by Tsvetan Ovedenski on 05/03/2020.
 */

data class Authentication (val userId: UserId)


interface Authenticator {
    fun authenticate(token: String): Authentication?
    fun token(authentication: Authentication): String
}


class InMemoryAuthenticator (
    private val findUser: (UserId) -> UserEntity?
) : Authenticator {

    private val tokens: MutableMap<String, UserId> = mutableMapOf()

    override fun authenticate(token: String): Authentication? = tokens[token]
        ?.let(findUser) // simulate user validation
        ?.id
        ?.let(::Authentication)

    override fun token(authentication: Authentication): String = UUID.randomUUID()
        .toString()
        .also { token -> tokens[token] = authentication.userId }
}


interface PasswordEncoder {
    fun encode(raw: String, salt: String? = null): String
    fun check(encoded: String, raw: String, salt: String? = null): Boolean
}

object BcryptPasswordEncoder : PasswordEncoder {
    override fun encode(raw: String, salt: String?): String {
        return BCrypt.hashpw(raw, salt ?: BCrypt.gensalt())
    }

    override fun check(encoded: String, raw: String, salt: String?): Boolean {
        return BCrypt.checkpw(raw, encoded)
    }

}