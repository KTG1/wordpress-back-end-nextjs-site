.PHONY: up setup seed logs down clean

up:
	docker compose up -d --build

setup:
	docker compose up -d db wordpress
	docker compose run --rm --entrypoint sh wpcli -c 'until wp core is-installed >/dev/null 2>&1 || wp core install --url="$$WORDPRESS_BACKEND_URL" --title="$$WORDPRESS_TITLE" --admin_user="$$WORDPRESS_ADMIN_USER" --admin_password="$$WORDPRESS_ADMIN_PASSWORD" --admin_email="$$WORDPRESS_ADMIN_EMAIL" --skip-email; do sleep 3; done'
	docker compose run --rm wpcli plugin activate headless-site-core
	docker compose run --rm wpcli plugin activate founder-settlement-calculator
	docker compose run --rm wpcli rewrite structure '/%postname%/' --hard
	docker compose up -d --build frontend

seed:
	docker compose run --rm wpcli post create --post_type=page --post_title='About' --post_status=publish --post_content='Use this page to introduce the person, practice, or company behind the work.'
	docker compose run --rm wpcli post create --post_type=post --post_title='The first field note' --post_status=publish --post_content='This post is coming from WordPress and rendered by Next.js.'

logs:
	docker compose logs -f wordpress frontend

down:
	docker compose down

clean:
	@echo "Run 'docker compose down --volumes' manually to remove all database and WordPress data."
