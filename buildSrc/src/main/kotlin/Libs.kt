import org.gradle.kotlin.dsl.*

object Libs {
    fun DependencyHandlerScope.http4k(what: String) = "implementation"(
        group = "org.http4k", name = "http4k-$what", version = Versions.http4k
    )

    fun DependencyHandlerScope.exposed(what: String) = "implementation"(
        group = "org.jetbrains.exposed", name = "exposed-$what", version = Versions.exposed
    )

    fun DependencyHandlerScope.h2() = "implementation"(
        group = "com.h2database", name = "h2", version = Versions.h2
    )

    fun DependencyHandlerScope.hikariCP() = "implementation"(
        group = "com.zaxxer", name = "HikariCP", version = Versions.hikariCP
    )

    fun DependencyHandlerScope.jbcrypt() = "implementation"(
        group = "org.mindrot", name = "jbcrypt", version = Versions.jbcrypt
    )

    fun DependencyHandlerScope.logger() {
        "implementation"(group = "org.slf4j", name = "slf4j-simple", version = Versions.slf4j)
    }
}
