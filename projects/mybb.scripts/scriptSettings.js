const scriptsSettings = {
    APP_ID: 16777215,
    STORAGE_KEY: 'scriptsSettings',
    init: async () => {
        await this.loadSettings()
        const isAdmin = /^\/admin_/.test(location.pathname)
        if (isAdmin) {
            this.renderLink()
        } else {
            Object.defineProperty(FORUM, this.STORAGE_KEY, {
                writable: false,
                configurable: false,
            });
        }
    },
    loadSettings: async () => {
        try {
            const { responseText } = await $.get('/api.php',{
                method: 'storage.get',
                key: this.STORAGE_KEY,
                app_id: this.APP_ID,
            })
            const response = JSON.parse(responseText)

            if (response.error) {
                // Если ещё не было никаких настроек
                if (error.code === '404') {
                    FORUM[this.STORAGE_KEY] = {}
                    return
                }
                throw new Error('')
            }

            FORUM[this.STORAGE_KEY] = response.response.storage.data
        } catch (error) {
            $.jGrowl(
                "Не удалось загрузить настройки скриптов, обновите страницу"
            )
        }
    },
    renderLink() {
        
    }
}