plugins {
    application
    jacoco
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
        http4k("cloudnative")

        exposed("core")
        exposed("jdbc")
        exposed("java-time")

        h2()
        hikariCP()

        jbcrypt()

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

    test {
        useJUnitPlatform()
        testLogging {
            events("passed", "skipped", "failed")
        }
    }
}

jacoco {
    toolVersion = "0.8.5"
    reportsDir = file("$buildDir/jacoco")
}


