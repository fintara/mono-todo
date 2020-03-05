plugins {
    application
    kotlin("jvm")

    with (Plugins) {
        shadowJar()
        kt2ts()
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

kt2ts {
    // Repeatable block for linking outputfile to a set of annotations
    output {
        outputFile = file("$buildDir/../../todo-frontend/src/kt2ts.d.ts")
        annotations = listOf("com.tsovedenski.todo.annotations.Typescript")
    }
    classFilesSources {
        // Two ways of setting classes dir, if both are set, both are jointly used
        // One has to be provided (for task input resolution to work properly, I made it mandatory)
        compileTasks = listOf(tasks.compileKotlin, tasks.compileJava)
        classesDirs = files("$buildDir/classes/kotlin/main")
    }
}