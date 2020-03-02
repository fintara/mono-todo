import org.gradle.kotlin.dsl.*

object TestLibs {
    fun DependencyHandlerScope.junit() =
        "testImplementation"(group = "org.junit.jupiter", name = "junit-jupiter", version = Versions.junit)

    fun DependencyHandlerScope.assertj() {
        "testImplementation"(group = "org.assertj", name = "assertj-core", version = Versions.assertj)
        "testImplementation"(
            group = "net.javacrumbs.json-unit",
            name = "json-unit-assertj",
            version = Versions.assertjJson
        )
    }

}