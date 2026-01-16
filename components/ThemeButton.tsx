import { Button } from "@/components/ui/button"
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const ThemeButton = () => {
    const { setTheme, theme } = useTheme()
    return (
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? <Sun /> : <Moon />}
        </Button>
    )
}

export default ThemeButton