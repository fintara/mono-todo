plugins {
    base
    kotlin("jvm") version Versions.kotlin apply false

    with (Plugins) {
        node() version Versions.plugins.node apply false
        shadowJar() version Versions.plugins.shadowJar apply false
    }
}

allprojects {
    group = "com.tsovedenski.todo"
    version = "1.0"

    repositories {
        mavenCentral()
        jcenter()
    }
}