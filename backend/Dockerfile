# backend/Dockerfile

# base Image
FROM python:3.11-slim

# environment Variables
# prevents Python from writing .pyc files and buffers stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# set Working Directory
WORKDIR /app

# create a non-root user (Security Step)
# this creates a group 'appgroup' and user 'appuser'
RUN addgroup --system appgroup && adduser --system --group appuser

# install Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# copy Hardening Script & Code
COPY container_hardening.sh .
COPY ./app /app/app

# set Permissions
# Make script executable
RUN chmod +x container_hardening.sh
# give ownership of EVERYTHING to the new user
RUN chown -R appuser:appgroup /app

# sWITCH USER (Critical Hardening Step)
# We become the weak user BEFORE the app starts
USER appuser

# entrypoint
# this runs your shell script first
ENTRYPOINT ["./container_hardening.sh"]

# start Command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]