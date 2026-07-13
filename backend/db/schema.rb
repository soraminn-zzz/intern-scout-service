# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_13_062600) do
  create_table "company_profiles", force: :cascade do |t|
    t.string "company_name"
    t.datetime "created_at", null: false
    t.text "description"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.string "website_url"
    t.index ["user_id"], name: "index_company_profiles_on_user_id"
  end

  create_table "favorite_interns", force: :cascade do |t|
    t.integer "company_id", null: false
    t.datetime "created_at", null: false
    t.integer "intern_id", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id", "intern_id"], name: "index_favorite_interns_on_company_id_and_intern_id", unique: true
    t.index ["company_id"], name: "index_favorite_interns_on_company_id"
    t.index ["intern_id"], name: "index_favorite_interns_on_intern_id"
  end

  create_table "intern_profiles", force: :cascade do |t|
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "desired_position"
    t.integer "graduation_year"
    t.string "school_name"
    t.text "skills"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_intern_profiles_on_user_id"
  end

  create_table "job_posts", force: :cascade do |t|
    t.integer "company_id", null: false
    t.datetime "created_at", null: false
    t.text "description", null: false
    t.boolean "is_active", default: true, null: false
    t.string "location"
    t.text "required_skills"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_job_posts_on_company_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "read_at"
    t.integer "receiver_id", null: false
    t.integer "sender_id", null: false
    t.datetime "updated_at", null: false
    t.index ["receiver_id"], name: "index_messages_on_receiver_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "saved_job_posts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "intern_id", null: false
    t.integer "job_post_id", null: false
    t.datetime "updated_at", null: false
    t.index ["intern_id", "job_post_id"], name: "index_saved_job_posts_on_intern_id_and_job_post_id", unique: true
    t.index ["intern_id"], name: "index_saved_job_posts_on_intern_id"
    t.index ["job_post_id"], name: "index_saved_job_posts_on_job_post_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "auth_token_digest"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.integer "role", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "company_profiles", "users"
  add_foreign_key "favorite_interns", "users", column: "company_id"
  add_foreign_key "favorite_interns", "users", column: "intern_id"
  add_foreign_key "intern_profiles", "users"
  add_foreign_key "job_posts", "users", column: "company_id"
  add_foreign_key "messages", "users", column: "receiver_id"
  add_foreign_key "messages", "users", column: "sender_id"
  add_foreign_key "saved_job_posts", "job_posts"
  add_foreign_key "saved_job_posts", "users", column: "intern_id"
end
