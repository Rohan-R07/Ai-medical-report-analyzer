

from nicegui import ui
from main import Backend

backend = Backend()

dark = ui.dark_mode()

response_md = None
spinner = None


def ask_ai():

    spinner.visible = True

    prompt = prompt_input.value

    result = backend.setUpOllama(prompt)

    response_md.set_content(result)

    spinner.visible = False


ui.colors(
    primary='#2563eb'
)

with ui.header().classes(
    'items-center justify-between'
):

    ui.label(
        '🤖 Local AI Assistant'
    ).classes(
        'text-2xl font-bold'
    )

    ui.button(
        '🌙',
        on_click=dark.toggle
    )


with ui.column().classes(
    'w-full items-center'
):

    ui.space()

    ui.label(
        'Chat with Ollama'
    ).classes(
        'text-4xl font-bold'
    )

    ui.label(
        'Powered by Gemma 2B'
    ).classes(
        'text-lg text-gray-500'
    )

    with ui.card().classes(
        'w-2/3 p-6'
    ):

        prompt_input = ui.textarea(
            label='Ask Anything'
        ).props(
            'outlined'
        ).classes(
            'w-full'
        )

        ui.button(
            '🚀 Generate Response',
            on_click=ask_ai
        ).classes(
            'w-full'
        )

    spinner = ui.spinner(
        size='lg'
    )

    spinner.visible = False

    with ui.card().classes(
        'w-2/3 p-6'
    ):

        ui.label(
            'AI Response'
        ).classes(
            'text-xl font-bold'
        )

        response_md = ui.markdown(
            'Response will appear here...'
        )

ui.run()