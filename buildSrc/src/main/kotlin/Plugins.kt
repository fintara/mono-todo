import org.gradle.plugin.use.PluginDependenciesSpec
import org.gradle.plugin.use.PluginDependencySpec

/**
 * Created by Tsvetan Ovedenski on 02/03/20.
 */
object Plugins {
    fun PluginDependenciesSpec.node(): PluginDependencySpec =
        id("com.github.node-gradle.node")

    fun PluginDependenciesSpec.shadowJar(): PluginDependencySpec =
        id("com.github.johnrengelman.shadow")
}