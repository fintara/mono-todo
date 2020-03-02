plugins {
    application
    kotlin("jvm")

    with (Plugins) {
        shadowJar()
    }
}

description = "This service is the gateway api"

application {
    mainClassName = "com.tsovedenski.todo.MainKt"
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))

    with (Libs) {
        http4k("core")
        http4k("server-jetty")
        http4k("format-jackson")

        exposed("core")
        exposed("jdbc")
        exposed("java-time")

        h2()

        logger()
    }

    with (TestLibs) {
        junit()
        assertj()
    }
}

tasks {
    compileKotlin {
        kotlinOptions.jvmTarget = Versions.jvmTarget
    }
    compileTestKotlin {
        kotlinOptions.jvmTarget = Versions.jvmTarget
    }
    shadowJar {
        mergeServiceFiles()
        archiveClassifier.set("")
    }
}

tasks {
    test {
        useJUnitPlatform()
        testLogging {
            events("passed", "skipped", "failed")
        }
    }
}