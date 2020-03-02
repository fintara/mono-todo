import com.moowork.gradle.node.yarn.YarnTask

plugins {
  with (Plugins) {
    node()
  }
}

node {
  version = "10.18.0"
  yarnVersion = "1.22.0"
  download = true
}

task<YarnTask>("yarn_install") {
  args = listOf("--frozen-lockfile")
}

task<YarnTask>("yarn_test") {
  args = listOf("test", "--watchAll=false", "--verbose")
}

tasks {
  val build by creating {
    dependsOn("yarn_build")
  }

  val test by creating {
    dependsOn("yarn_test")
  }
}
