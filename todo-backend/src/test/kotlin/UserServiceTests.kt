package com.tsovedenski.todo

import com.tsovedenski.todo.database.TxManager
import com.tsovedenski.todo.database.repositories.UserRepository
import com.tsovedenski.todo.exceptions.AuthenticationError
import com.tsovedenski.todo.exceptions.RegistrationError
import com.tsovedenski.todo.models.Credentials
import com.tsovedenski.todo.models.Registration
import com.tsovedenski.todo.models.User
import com.tsovedenski.todo.models.UserEntity
import com.tsovedenski.todo.services.UserService
import com.tsovedenski.todo.services.UserServiceImpl
import com.tsovedenski.todo.test.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

/**
 * Created by Tsvetan Ovedenski on 28/05/2020.
 */
class UserServiceTests {

    companion object {
        private val passwordEncoder = object : PasswordEncoder {
            override fun encode(raw: String, salt: String?): String = "1_${raw}_2"

            override fun check(encoded: String, raw: String, salt: String?): Boolean =
                encode(raw) == encoded
        }
    }

    private lateinit var tx: TxManager<UserRepository>

    private lateinit var sut: UserService

    @BeforeEach
    fun setup() {
        tx = inMemoryTx(InMemoryUserRepository())
        sut = UserServiceImpl(passwordEncoder, tx)
    }

    @Test
    fun `findByCredentials for valid credentials succeeds`() {
        val cred = Credentials("unit@test.com", "s3cr3t1").insert()

        val user = sut.findByCredentials(cred)

        assertRight(user) { it.payload.email == cred.email }
    }

    @Test
    fun `findByCredentials for invalid email fails`() {
        val cred = Credentials("unit@test.com", "s3cr3t1").insert()

        val user = sut.findByCredentials(cred.copy(email = "bad@email.com"))

        assertLeft(user) { it is AuthenticationError.WrongEmail }
    }

    @Test
    fun `findByCredentials for invalid password fails`() {
        val cred = Credentials("unit@test.com", "s3cr3t1").insert()

        val user = sut.findByCredentials(cred.copy(password = "xxxxxxxxxx"))

        assertLeft(user) { it is AuthenticationError.WrongPassword }
    }

    @Test
    fun `create for new email succeeds`() {
        val form = Registration("unit@test.com", "s3cr3t1", null)

        val user = sut.create(form)

        assertRight(user)
    }

    @Test
    fun `create for existing email fails`() {
        val cred = Credentials("unit@test.com", "s3cr3t1").insert()
        val form = Registration(cred.email, cred.password, null)

        val user = sut.create(form)

        assertLeft(user) { it is RegistrationError.EmailExists && it.value == cred.email }
    }

    private fun Credentials.insert() = also {
        tx { insert(User(email, passwordEncoder.encode(password), null))}
    }
}